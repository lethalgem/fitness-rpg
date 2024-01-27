use std::mem::size_of_val;

use worker::Date;

use crate::{db, helpers::log, strava::models::StravaAuthCode, SharedData};

use super::{
    errors::StravaAPIError,
    models::{
        AccessTokenRequest, AccessTokenResponse, ListAthleteActivitiesRequest,
        ListAthleteActivitiesResponse, RefreshTokenRequest, RefreshTokenResponse,
        StravaAthleteAuthInfo, StravaClientAuthInfo,
    },
};

const STRAVA_API_BASE_URL: &str = "https://www.strava.com/api/v3";

pub async fn get_client_auth_info(
    shared_data: &SharedData,
) -> Result<StravaClientAuthInfo, StravaAPIError> {
    log("going to retrieve all client auth info from db");
    let client_auth_info = db::retrieve_strava_client_auth_info(&shared_data.db)
        .await
        .map_err(Box::new)?;
    log("going to see if we need to refresh");
    refresh_client_access_token_if_necessary(client_auth_info, shared_data).await
}

pub async fn get_athlete_auth_info(
    athlete_id: i32,
    shared_data: &SharedData,
) -> Result<StravaAthleteAuthInfo, StravaAPIError> {
    log("going to retrieve all auth info from db");
    let athlete_auth_info = db::retrieve_strava_athlete_auth_info(&shared_data.db, athlete_id)
        .await
        .map_err(Box::new)?;
    log("going to see if we need to refresh");
    refresh_athlete_access_token_if_necessary(athlete_auth_info, shared_data).await
}

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
    let client_auth_info = get_client_auth_info(shared_data).await?;
    let header_value = reqwest::header::HeaderValue::from_str(&format!(
        "Bearer {}",
        client_auth_info.access_token
    ))?;
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

pub async fn refresh_athlete_access_token_if_necessary(
    athlete_auth_info: StravaAthleteAuthInfo,
    shared_data: &SharedData,
) -> Result<StravaAthleteAuthInfo, StravaAPIError> {
    log("Starting refresh_athlete_access_token_if_necessary function");

    let current_time = Date::now().as_millis() / 1000;
    log(&format!("current_time: {}", current_time));
    let ten_min_buffer = 600;
    log(&format!(
        "expires_at: {}",
        athlete_auth_info.expires_at.clone()
    ));
    if current_time >= (athlete_auth_info.expires_at.parse::<u64>()? - ten_min_buffer) {
        log("Access token is expired or about to expire, refreshing...");
        let updated_athlete_auth_info_response =
            request_access_token_with_refresh_token(&athlete_auth_info.refresh_token, shared_data)
                .await?;
        log("Received updated athlete auth info response");
        let confirmed_updated_athlete_auth_info = db::write_updated_athlete_auth_info(
            updated_athlete_auth_info_response,
            athlete_auth_info.athlete_id,
            &shared_data.db,
        )
        .await
        .map_err(Box::new)?;
        log("Updated athlete auth info written to database");
        Ok(confirmed_updated_athlete_auth_info)
    } else {
        log("Access token is still valid, no need to refresh");
        Ok(athlete_auth_info)
    }
}

pub async fn refresh_client_access_token_if_necessary(
    client_auth_info: StravaClientAuthInfo,
    shared_data: &SharedData,
) -> Result<StravaClientAuthInfo, StravaAPIError> {
    log("Starting refresh_client_access_token_if_necessary function");

    let current_time = Date::now().as_millis() / 1000;
    log(&format!("current_time: {}", current_time));
    let ten_min_buffer = 600;
    if current_time >= (client_auth_info.expires_at.parse::<u64>()? - ten_min_buffer) {
        log("Access token is expired or about to expire, refreshing...");
        let updated_client_auth_info_response =
            request_access_token_with_refresh_token(&client_auth_info.refresh_token, shared_data)
                .await?;
        log("Received updated athlete auth info response");
        let confirmed_updated_client_auth_info =
            db::write_updated_client_auth_info(updated_client_auth_info_response, &shared_data.db)
                .await
                .map_err(Box::new)?;
        log("Updated athlete auth info written to database");
        Ok(confirmed_updated_client_auth_info)
    } else {
        log("Access token is still valid, no need to refresh");
        Ok(client_auth_info)
    }
}

pub async fn request_access_token_with_refresh_token(
    refresh_token: &str,
    shared_data: &SharedData,
) -> Result<RefreshTokenResponse, StravaAPIError> {
    log("Starting request_access_token_with_refresh_token");

    let body = RefreshTokenRequest::new(
        refresh_token.to_owned(),
        shared_data.env.client_id.clone(),
        shared_data.env.client_secret.clone(),
    )?;
    let strava_auth_url = STRAVA_API_BASE_URL.to_owned() + "/oauth/token";

    let client = reqwest::Client::new();

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
        "accept",
        reqwest::header::HeaderValue::from_static("application/json"),
    );

    log("Sending request to Strava");
    let req = client.post(strava_auth_url).headers(headers).json(&body);

    let response = req.send().await?;
    match response.error_for_status() {
        Ok(response) => {
            log("Received successful response from Strava");
            let body = response.text().await?;
            log(&format!("body received: {}", body));
            let auth_response: RefreshTokenResponse = serde_json::from_str(&body)?;
            Ok(auth_response)
        }
        Err(e) => Err(StravaAPIError::ReqwestError(e)),
    }
}

pub async fn request_all_athlete_activities(
    athlete_auth_info: &StravaAthleteAuthInfo,
) -> Result<ListAthleteActivitiesResponse, StravaAPIError> {
    log("Starting request_all_athlete_activities");
    let yeet = request_specific_page_of_athlete_activities(athlete_auth_info, 1).await?;
    Ok(yeet)
}

pub async fn request_specific_page_of_athlete_activities(
    athlete_auth_info: &StravaAthleteAuthInfo,
    page: i32,
) -> Result<ListAthleteActivitiesResponse, StravaAPIError> {
    log(&format!(
        "Starting request_specific_page_of_athlete_activities for page: {}",
        page
    ));

    let strava_request_url = STRAVA_API_BASE_URL.to_owned() + "/athlete/activities";

    let client = reqwest::Client::new();

    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
        "accept",
        reqwest::header::HeaderValue::from_static("application/json"),
    );

    let header_value = reqwest::header::HeaderValue::from_str(&format!(
        "Bearer {}",
        athlete_auth_info.access_token
    ))?;
    headers.insert("Authorization", header_value);

    log("Sending request to Strava");
    let req = client
        .get(strava_request_url)
        .headers(headers)
        .query(&[("per_page", "30")]);

    let response = req.send().await?;
    match response.error_for_status() {
        Ok(response) => {
            log("Received successful response from Strava");
            let body = response.text().await?;
            log(&format!("body received: {}", body));
            let activities_response: ListAthleteActivitiesResponse = serde_json::from_str(&body)?;
            log(&format!(
                "The useful size of `the activity vector` is {}",
                size_of_val(&*activities_response)
            ));
            Ok(activities_response)
        }
        Err(e) => {
            log("Received error response from Strava");
            Err(StravaAPIError::ReqwestError(e))
        }
    }
}
