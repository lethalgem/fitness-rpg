mod db;
mod errors;
mod handlers;
mod helpers;
mod models;
mod strava;
use handlers::*;
use serde::{Deserialize, Serialize};
use worker::*;

// This is a shared data struct that we will pass to the router
pub struct SharedData {
    env: Environment,
    db: D1Database,
}

pub struct Environment {
    client_id: String,
    client_secret: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Comment {
    id: u32,
    author: String,
    body: String,
    post_slug: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, ctx: Context) -> Result<Response> {
    let shared_data = SharedData {
        env: Environment {
            client_id: env
                .var("STRAVA_CLIENT_ID")
                .expect("Missing Client ID environment variable")
                .to_string(),
            client_secret: env
                .var("STRAVA_CLIENT_SECRET")
                .expect("Missing Client Secret environment variable")
                .to_string(),
        },
        db: env.d1("DATABASE")?,
    };

    let router = Router::with_data(shared_data);

    router
        .get("/", |_, ctx| Response::ok("Hello, World!"))
        .get("/strava-integration-redirect-uri", |mut req, ctx| {
            Response::ok("This will never exist, it will be in the front end")
        })
        .post_async("/auth_with_strava", |req, ctx| async move {
            match auth_with_strava(req, &ctx.data).await {
                Ok(code) => Response::ok(code),
                Err(err) => Response::ok(format!("{}", err)),
            }
        })
        .post_async("/get_strava_activities", |req, ctx| async move {
            match retrieve_strava_activities(req, &ctx.data).await {
                Ok(code) => Response::ok(code),
                Err(err) => Response::ok(format!("{}", err)),
            }
        })
        .get("/shared-data", |_, ctx| {
            // let shared_data = ctx.env.name;
            Response::ok("yeet")
        })
        .run(req, env)
        .await
}
