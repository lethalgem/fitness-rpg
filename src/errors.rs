use thiserror::Error;

use crate::strava::errors::StravaAPIError;

#[derive(Error, Debug)]
pub enum GeneralError {
    #[error("This error is expected. Only use when testing.")]
    TestError,
    #[error(transparent)]
    StravaError(#[from] StravaAPIError),
    #[error(transparent)]
    D1DbError(#[from] MyD1Error),
    #[error(transparent)]
    WorkerError(#[from] worker::Error),
    #[error("Failed to find Strava client auth info in database")]
    DbErrorNoStravaClientAuthInfo,
    #[error("Failed to write Strava athlete auth info in database")]
    DBErrorFailedToWriteStravaAthleteAuthInfo,
    #[error("{0}")]
    DbError(String),
}

use std::fmt;

#[derive(Debug)]
pub struct MyD1Error(worker::D1Error);

impl fmt::Display for MyD1Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::error::Error for MyD1Error {}
