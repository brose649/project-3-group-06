import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np
import sqlite3

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///ufo.sqlite")
        # self.Base = None

        # automap Base classes
        # self.init_base()

    # COMMENT BACK IN IF USING THE ORM

    # def init_base(self):
    #     # reflect an existing database into a new model
    #     self.Base = automap_base()
    #     # reflect the tables
    #     self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_frequency(self, year):

        if year == 'All':
            where_clause = "1=1"
        else:
            where_clause = f"year = { year }"

        query = f"""
                SELECT 
                    year AS years, 
                    COUNT(*) AS frequency
                FROM 
                    ufo
                WHERE
                    {where_clause}
                GROUP BY 
                    years
                ORDER BY 
                    years DESC;
                """
        
        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_by_month(self, year):

        where_clause = f"year = {year}"

        query = f"""
                SELECT
                    year,
                    month,
                    COUNT(*) AS frequency
                FROM
                    ufo
                WHERE
                    {where_clause}
                GROUP BY
                    year, month
                ORDER BY 
                    year DESC, month ASC;
            """
        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return(data)

    # def get_table(self, year):
    #     # switch on user_region
    #     if year == 'All':
    #         where_clause = "and 1=1"
    #     else:
    #         where_clause = f"and year = '{year}'"
    #     # build the query
    #     query = f"""
    #         SELECT
    #             dayofweek,
    #             city,
    #             state,
    #             hour,
    #             month,
    #             year,
    #             latitude,
    #             longitude
    #         FROM
    #             ufo
    #         WHERE
    #             {where_clause}
    #         ORDER BY
    #             dayofweek DESC;
    #     """
    #     df = pd.read_sql(text(query), con = self.engine)
    #     data = df.to_dict(orient="records")
    #     return(data)

    # USING RAW SQL
    def get_bar(self, shape, state):
        query = """
            SELECT
                shape,
                state
            FROM
                ufo
            WHERE
                shape = :shape AND state = :state;
        """
        df = pd.read_sql(query, con=self.engine, params={"shape": shape, "state": state})
        data = df.to_dict(orient="records")
        return data

    def get_map(self, category, state):

        # switch on state
        if state == 'All':
            state_clause = "and 1=1"
        else:
            state_clause = f"and state = '{state}'"

        # # switch on shape
        # if shape == 'All':
        #     shape_clause = "and 1=1"
        # else:
        #     shape_clause = f"and shape = '{shape}'"

        # switch on category
        if category == 'All':
            category_clause = "and 1=1"
        else:
            category_clause = f"and category = '{category}'"

        # build the query
        query = f"""
                    SELECT
                        datetime,
                        city,
                        state,
                        country,
                        shape,
                        category,
                        duration_seconds,
                        duration_hours_min,
                        comments,
                        date_posted,
                        latitude,
                        longitude,
                        hour,
                        month,
                        year,
                        dayofweek
                    FROM
                        ufo
                    WHERE
                        1=1
                        {category_clause}
                        {state_clause}
                    ORDER BY
                        datetime DESC;
                """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
