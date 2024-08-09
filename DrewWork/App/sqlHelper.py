import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

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
    def get_bar(self, min_attempts, region):

        # switch on user_region
        if region == 'All':
            where_clause = "and 1=1"
        else:
            where_clause = f"and region = '{region}'"

        # build the query
        query = f"""
            SELECT
                name,
                full_name,
                region,
                launch_attempts,
                launch_successes
            FROM
                launchpads
            WHERE
                launch_attempts >= {min_attempts}
                {where_clause}
            ORDER BY
                launch_attempts DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_pie(self, min_attempts, region):

        # switch on user_region
        if region == 'All':
            where_clause = "and 1=1"
        else:
            where_clause = f"and region = '{region}'"

        # build the query
        query = f"""
            SELECT
                name,
                region,
                launch_attempts
            FROM
                launchpads
            WHERE
                launch_attempts >= {min_attempts}
                {where_clause}
            ORDER BY
                launch_attempts DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_table(self, min_attempts, region):

        # switch on user_region
        if region == 'All':
            where_clause = "and 1=1"
        else:
            where_clause = f"and region = '{region}'"

        # build the query
        query = f"""
            SELECT
                name,
                full_name,
                region,
                latitude,
                longitude,
                launch_attempts,
                launch_successes,
                launch_attempts - launch_successes as launch_failures
            FROM
                launchpads
            WHERE
                launch_attempts >= {min_attempts}
                {where_clause}
            ORDER BY
                launch_attempts DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_map(self, shape, state):

        # switch on state
        if state == 'All':
            state_clause = "and 1=1"
        else:
            state_clause = f"and state = '{state}'"

        # switch on shape
        if shape == 'All':
            shape_clause = "and 1=1"
        else:
            shape_clause = f"and shape = '{shape}'"

        # build the query
        query = f"""
                    SELECT
                        datetime,
                        city,
                        state,
                        country,
                        shape,
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
                        {shape_clause}
                        {state_clause}
                    ORDER BY
                        datetime DESC;
                """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
