use worker::D1Database;

use crate::{errors::GeneralError, helpers::log, models::StravaClientInfo};

pub async fn retrieve_strava_client_access_token(db: D1Database) -> Result<String, GeneralError> {
    let statement = db.prepare("SELECT * FROM strava_client_info WHERE id=1");
    let result = statement.all().await?;
    let info = result.results::<StravaClientInfo>()?;
    log(&format!("{:?}", info));

    // TODO: deal with having an expired token
    Ok(info
        .first()
        .ok_or_else(|| GeneralError::DbErrorNoStravaClientInfo)?
        .access_token
        .clone())
}

// TODO: store new strava client info in db
