use thiserror::Error;

use crate::strava::errors::StravaAPIError;

#[derive(Error, Debug)]
pub enum GeneralError {
    #[error("This error is expected. Only use when testing.")]
    TestError,
    #[error("Failed to use Strava API")]
    StravaError(#[from] StravaAPIError),
    #[error("Failed to properly use Cloudflare Worker")]
    StravaAuthFailed(#[from] worker::Error),
}
