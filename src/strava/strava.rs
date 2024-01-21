use crate::{db, helpers::log, strava::models::StravaAuthCode, SharedData};

use super::{
    errors::StravaAPIError,
    models::{AccessTokenRequest, AccessTokenResponse},
};

const STRAVA_API_BASE_URL: &str = "https://www.strava.com/api/v3";

pub async fn request_access_token_with_code(
    code: StravaAuthCode,
    shared_data: &SharedData,
) -> Result<AccessTokenResponse, StravaAPIError> {
    log("Starting request_access_token_with_code");

    let body = AccessTokenRequest::new(
        code,
        shared_data.env.client_id.clone(),
        shared_data.env.client_secret.clone(),
    )?;
    let strava_auth_url = "https://www.strava.com/oauth/token";

    let client = reqwest::Client::new();

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
        "accept",
        reqwest::header::HeaderValue::from_static("application/json"),
    );

    log("Retrieving Strava client access token");
    let client_access_token = db::retrieve_strava_client_access_token(&shared_data.db)
        .await
        .map_err(Box::new)?;
    let header_value =
        reqwest::header::HeaderValue::from_str(&format!("Bearer {}", client_access_token))?;
    headers.insert("Authorization", header_value);

    log("Sending request to Strava");
    let req = client.post(strava_auth_url).headers(headers).json(&body);

    let response = req.send().await?;
    match response.error_for_status() {
        Ok(response) => {
            log("Received successful response from Strava");
            let body = response.text().await?;
            log(&format!("body received: {}", body));
            let auth_response: AccessTokenResponse = serde_json::from_str(&body)?;
            Ok(auth_response)
        }
        Err(e) => Err(StravaAPIError::ReqwestError(e)),
    }
}
