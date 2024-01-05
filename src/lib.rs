mod errors;
mod handlers;
mod models;
mod strava;

use futures::future::join_all;
use handlers::*;
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use worker::*;

// This is a shared data struct that we will pass to the router
struct SharedData {
    name: String,
}

// This is the struct that we will use to store and retrieve data from KV. It implements Serialize and Deserialize
#[derive(Clone, Debug, Deserialize, Serialize)]
struct AnimalRescue {
    id: u8,
    name: String,
    age: u8,
    species: String,
}

// This is the struct that we will use to update data in KV. It implements Serialize and Deserialize
#[derive(Clone, Debug, Deserialize, Serialize)]
struct AnimalRescueUpdate {
    name: String,
    age: u8,
    species: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, ctx: Context) -> Result<Response> {
    let shared_data = SharedData {
        name: "Rusty".to_string(),
    };

    let router = Router::with_data(shared_data);

    router
        .get("/", |_, ctx| Response::ok("Hello, World!"))
        .get("/strava-integration-redirect-uri", |mut req, ctx| {
            Response::ok("This will never exist, it will be in the front end")
        })
        .post_async("/auth_with_strava", |mut req, _| async move {
            match auth_with_strava(req).await {
                Ok(code) => Response::ok(code),
                Err(err) => Response::ok(format!("{}", err)),
            }
        })
        .get("/shared-data", |_, ctx| {
            let shared_data = ctx.data.name;
            Response::ok(shared_data)
        })
        .get_async("/rescues", |mut req, ctx| async move {
            let shared_data = ctx.data.name;
            Response::ok(shared_data)
        })
        .run(req, env)
        .await
}
