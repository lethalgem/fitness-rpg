use log::error;
use worker::Request;

use crate::{errors::GeneralError, models::StravaAuthCode, strava::strava, Environment};

pub async fn auth_with_strava(mut req: Request, env: Environment) -> Result<String, GeneralError> {
    error!("{:?}", req);
    let auth_code = req.json::<StravaAuthCode>().await?;
    let response = strava::request_access_token(auth_code).await?;
    // let code = auth_code.code;

    Ok(format!("{:?}", response))
    /* TODO: take code, send to strava, receive response, dump needed data to database -- then on to retrieving activities! */
}
