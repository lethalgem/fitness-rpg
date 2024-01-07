use crate::models::StravaAuthCode;

use super::{
    errors::StravaAPIError,
    models::{AccessTokenRequest, AccessTokenResponse},
};

const STRAVA_API_BASE_URL: &str = "https://www.strava.com/api/v3";

pub async fn request_access_token(
    code: StravaAuthCode,
) -> Result<AccessTokenResponse, StravaAPIError> {
    let body = AccessTokenRequest::new(code)?;
    let strava_auth_url = "https://www.strava.com/oauth/token";

    let client = reqwest::Client::new();

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
        "accept",
        reqwest::header::HeaderValue::from_static("application/json"),
    );
    let client_access_token = std::env::var("CLIENT_ACCESS_TOKEN")
        .map_err(|_| StravaAPIError::MissingClientAccessTokenEnvironmentVariable)?;
    let header_value =
        reqwest::header::HeaderValue::from_str(&format!("Bearer {}", client_access_token))?;
    headers.insert("Authorization", header_value);

    let req = client.post(strava_auth_url).headers(headers).json(&body);

    let response = req.send().await?;
    if response.status().is_success() {
        let body = response.text().await?;
        let auth_response: AccessTokenResponse = serde_json::from_str(&body)?;
        Ok(auth_response)
    } else {
        Err(StravaAPIError::FailedStravaAuthResponse)
    }
}
