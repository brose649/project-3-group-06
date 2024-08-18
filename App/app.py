from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/work_cited")
def work_cited():
    return render_template("work_cited.html")

# SQL Queries
@app.route("/api/v1.0/get_dashboard/<year>")
def get_dashboard(year):
    table_data = sql.get_table(year)
    data = {
        "table_data": table_data
    }
    return(jsonify(data))

@app.route("/api/v1.0/get_map/<shape>/<state>")
def get_map(shape, state):
    map_data = sql.get_map(shape, state)

    return(jsonify(map_data))

@app.route("/api/v1.0/get_frequency/<years>")
def get_freq(years):
    # execute the queries
    if(years == "All"):
        line_data = sql.get_frequency(years)
    else:
        line_data = sql.get_by_month(years)    
    
    table_data = sql.get_table(years)

    # Provide data from both queries into single json object
    data = {"line_data": line_data,
            "table_data": table_data}

    return jsonify(data)

# Run the App
if __name__ == '__main__':
    app.run(debug=True)
