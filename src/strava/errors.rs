use std::num::ParseIntError;

use thiserror::Error;

use crate::errors::GeneralError;

#[derive(Error, Debug)]
pub enum StravaAPIError {
    #[error("Strava Auth API Responsed with Failure")]
    FailedStravaAuthResponse,
    #[error(transparent)]
    HeaderValueCreationError(#[from] reqwest::header::InvalidHeaderValue),
    #[error(transparent)]
    ReqwestError(#[from] reqwest::Error),
    #[error(transparent)]
    SerdeJsonError(#[from] serde_json::Error),
    #[error(transparent)]
    DBError(#[from] Box<GeneralError>),
    #[error(transparent)]
    ParseIntError(#[from] ParseIntError),
}
