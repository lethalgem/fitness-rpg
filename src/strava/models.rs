use serde::{Deserialize, Deserializer, Serialize};

use super::errors::StravaAPIError;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAuthCode {
    pub code: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAthleteId {
    pub athlete_id: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaClientAuthInfo {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
    pub id: i32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RefreshTokenRequest {
    pub client_id: String,
    pub client_secret: String,
    pub refresh_token: String,
    pub grant_type: String,
}

impl RefreshTokenRequest {
    pub fn new(
        refresh_token: String,
        client_id: String,
        client_secret: String,
    ) -> Result<RefreshTokenRequest, StravaAPIError> {
        Ok(RefreshTokenRequest {
            client_id,
            client_secret,
            refresh_token,
            grant_type: "refresh_token".to_owned(),
        })
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RefreshTokenResponse {
    pub token_type: String,
    pub expires_at: i64,
    pub expires_in: i64,
    pub refresh_token: String,
    pub access_token: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAthleteAuthInfo {
    pub athlete_id: i32,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccessTokenRequest {
    pub client_id: String,
    pub client_secret: String,
    pub code: String,
    pub grant_type: String,
}

impl AccessTokenRequest {
    pub fn new(
        code: StravaAuthCode,
        client_id: String,
        client_secret: String,
    ) -> Result<AccessTokenRequest, StravaAPIError> {
        Ok(AccessTokenRequest {
            client_id,
            client_secret,
            code: code.code,
            grant_type: "authorization_code".to_owned(),
        })
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccessTokenResponse {
    pub token_type: String,
    pub expires_at: i64,
    pub expires_in: i64,
    pub refresh_token: String,
    pub access_token: String,
    pub athlete: Athlete,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Athlete {
    pub id: i32,
    pub resource_state: ResourceState,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub profile_medium: Option<String>,
    pub profile: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub country: Option<String>,
    pub sex: Option<String>,
    pub friend: Option<String>,
    pub follower: Option<String>,
    pub premium: Option<bool>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub approve_followers: Option<bool>,
    pub follower_count: Option<i32>,
    pub friend_count: Option<i32>,
    pub mutual_friend_count: Option<i32>,
    pub date_preference: Option<String>,
    pub measurement_preference: Option<String>,
    pub email: Option<String>,
    pub ftp: Option<i32>,
    pub weight: Option<f32>,
    pub athlete_type: Option<i32>,
    pub clubs: Option<Vec<Club>>,
    pub shoes: Option<Vec<Gear>>,
    pub bikes: Option<Vec<Gear>>,
    pub username: Option<String>,
    pub bio: Option<String>,
    pub summit: Option<bool>,
    pub badge_type_id: Option<i32>,
}

#[derive(Clone, Debug, Serialize)]
pub enum ResourceState {
    Unknown,
    Meta,
    Summary,
    Detailed,
}

impl<'de> Deserialize<'de> for ResourceState {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let i = i32::deserialize(deserializer)?;
        match i {
            1 => Ok(ResourceState::Meta),
            2 => Ok(ResourceState::Summary),
            3 => Ok(ResourceState::Detailed),
            _ => Ok(ResourceState::Unknown),
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Club {
    id: i32,
    resource_state: ResourceState,
    name: String,

    profile_medium: Option<String>,
    profile: Option<String>,
    cover_photo: Option<String>,
    cover_photo_small: Option<String>,
    sport_type: Option<SportType>,
    city: Option<String>,
    state: Option<String>,
    country: Option<String>,
    private: Option<bool>,
    member_count: Option<i32>,
    featured: Option<bool>,
    verified: Option<bool>,
    url: Option<String>,

    description: Option<String>,
    club_type: Option<ClubType>,
    membership: Option<String>,
    admin: Option<bool>,
    owner: Option<bool>,
    following_count: Option<i32>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[allow(non_camel_case_types)]
pub enum SportType {
    cycling,
    running,
    triathlon,
    other,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[allow(non_camel_case_types)]
pub enum ClubType {
    casual_club,
    racing_team,
    shop,
    company,
    other,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Gear {
    pub id: String,
    pub primary: bool,
    pub name: String,
    pub distance: f32,
    pub resource_state: ResourceState,
    pub brand_name: Option<String>,
    pub model_name: Option<String>,
    pub frame_type: Option<FrameType>,
    pub description: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum FrameType {
    MTB,
    Cross,
    Road,
    TimeTrial,
}
