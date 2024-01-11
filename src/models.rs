use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAuthCode {
    pub code: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaClientInfo {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
    pub id: u32,
}
