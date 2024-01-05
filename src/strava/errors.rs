use thiserror::Error;

#[derive(Error, Debug)]
pub enum StravaAPIError {
    #[error("Strava Auth API Responsed with Failure")]
    FailedStravaAuthResponse,
}
