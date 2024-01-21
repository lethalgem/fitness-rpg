use worker::Request;

use crate::{
    errors::GeneralError, helpers::log, models::StravaAuthCode, strava::strava, SharedData,
};

pub async fn auth_with_strava(
    mut req: Request,
    shared_data: SharedData,
) -> Result<String, GeneralError> {
    let auth_code = req.json::<StravaAuthCode>().await?;
    log(&format!("retrieved code: {:?}", auth_code.code.clone()));
    let response = strava::request_access_token_with_code(auth_code, shared_data).await?;

    Ok(format!("{:?}", response))
    /* TODO: take code, send to strava, receive response, dump needed data to database -- then on to retrieving activities! */
}
