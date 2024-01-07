use thiserror::Error;

#[derive(Error, Debug)]
pub enum StravaAPIError {
    #[error("Strava Auth API Responsed with Failure")]
    FailedStravaAuthResponse,
    #[error("Strava API Auth Request Client ID Environment Variable Missing")]
    MissingClientIdEnvironmentVariable,
    #[error("Strava API Auth Request Client Secret Environment Variable Missing")]
    MissingClientSecretEnvironmentVariable,
    #[error("Strava API Client Access Token Environment Variable Missing")]
    MissingClientAccessTokenEnvironmentVariable,
    #[error("Strava API Invalid Header")]
    HeaderValueCreationError(#[from] reqwest::header::InvalidHeaderValue),
    #[error("Strava API Reqwest Error")]
    ReqwestError(#[from] reqwest::Error),
    #[error("Strava API Json Error")]
    SerdeJsonError(#[from] serde_json::Error),
}
