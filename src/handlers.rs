use log::error;
use worker::Request;

use crate::{errors::GeneralError, models::StravaAuthCode};

pub async fn auth_with_strava(mut req: Request) -> Result<String, GeneralError> {
    error!("{:?}", req);
    let body = req.json::<StravaAuthCode>().await?;
    let code = body.code;
    Ok(code)
    /* TODO: take code, send to strava, receive response, dump needed data to database -- then on to retrieving activities! */
}
