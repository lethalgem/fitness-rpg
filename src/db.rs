use worker::D1Database;

use crate::{errors::GeneralError, models::StravaClientInfo};

async fn retrieve_strava_client_info(db: D1Database) -> Result<StravaClientInfo, GeneralError> {
    let statement = db.prepare("SELECT * FROM strava_client_info LIMIT 1");
    let result = statement.all().await?;
    let info = result.results::<StravaClientInfo>()?;
    info.first()
        .ok_or_else(|| GeneralError::DbErrorNoStravaClientInfo)
        .cloned()
}

// TODO: store new strava client info in db
