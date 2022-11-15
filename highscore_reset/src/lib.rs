use anyhow::{ Result};
use rusty_ulid::Ulid;
use serde::{Deserialize, Serialize};
use spin_sdk::{
    http::{Request, Response},
    http_component, redis,
};

#[http_component]
fn highscore_reset(_req: Request) -> Result<Response> {
    let redis_address = std::env::var("REDIS_ADDRESS")?;

    let high_score_table: Vec<HighScore> = Vec::new();

    let result = redis::set(
        &redis_address,
        "fw-highscore-list",
        &serde_json::to_vec_pretty(&high_score_table)?,
    );

    let mut status = 200;
    let response = match result {
        Ok(_) => "success",
        _ => {
            status = 500;
            "failed to reset high score"
        }
    };

    Ok(http::Response::builder()
        .status(status)
        .body(Some(response.into()))?)
}

#[derive(Deserialize, Serialize)]
struct HighScore {
    score: i32,
    username: String,
    ulid: Option<Ulid>,
}
