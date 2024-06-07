import os
import time
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
import asyncio

# Define constants
SEASONS = list(range(1980, 2023))
DATA_DIR = "data"
STANDINGS_DIR = os.path.join(DATA_DIR, "standings")
SCORES_DIR = os.path.join(DATA_DIR, "scores")

# Function to get HTML content
async def get_html(url, selector, sleep=5, retries=3):
    html = None
    for i in range(1, retries+1):
        time.sleep(sleep * i)
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch()
                page = await browser.new_page()
                await page.goto(url)
                html = await page.inner_html(selector)
        except PlaywrightTimeout:
            print(f"Timeout error on {url}")
            continue
        else:
            break
    return html

# Function to scrape a season's data
async def scrape_season(season):
    url = f"https://www.basketball-reference.com/leagues/NBA_{season}_games.html"
    html = await get_html(url, "#content .filter")
    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a")
    standings_pages = [f"https://www.basketball-reference.com{l['href']}" for l in links]
    
    for url in standings_pages:
        save_path = os.path.join(STANDINGS_DIR, url.split("/")[-1])
        if os.path.exists(save_path):
            continue
        html = await get_html(url, "#all_schedule")
        with open(save_path, "w+") as f:
            f.write(html)

# Function to parse data and save to CSV
def parse_data():
    all_games = []
    
    # Parse each file in standings directory
    for filename in os.listdir(STANDINGS_DIR):
        filepath = os.path.join(STANDINGS_DIR, filename)
        with open(filepath, "r") as file:
            soup = BeautifulSoup(file, "html.parser")
            schedule_table = soup.find("table", id="schedule")
            
            if schedule_table:
                for row in schedule_table.find("tbody").find_all("tr"):
                    game = {}
                    cells = row.find_all("td")
                    if len(cells) > 0:
                        game["date"] = row.find("th").text
                        game["home_team"] = cells[1].text
                        game["away_team"] = cells[0].text
                        game["home_score"] = int(cells[3].text) if cells[3].text.isdigit() else None
                        game["away_score"] = int(cells[2].text) if cells[2].text.isdigit() else None
                        all_games.append(game)
    
    games_df = pd.DataFrame(all_games)
    games_df.to_csv("nba_games.csv", index=False)

# Function to load data and train the model
def train_model():
    df = pd.read_csv("nba_games.csv")
    df['home_win'] = df['home_score'] > df['away_score']
    
    # Example features and target
    X = df[['home_score', 'away_score']]
    y = df['home_win']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model = LogisticRegression()
    model.fit(X_train, y_train)
    
    # Make predictions
    predictions = model.predict(X_test)
    
    # Evaluate the model
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model accuracy: {accuracy * 100:.2f}%")
    
    # Save the model
    joblib.dump(model, "nba_model.joblib")

# Main execution
if __name__ == "__main__":
    # Scrape data
    for season in SEASONS:
        asyncio.run(scrape_season(season))
    
    # Parse data
    parse_data()
    
    # Train model
    train_model()
