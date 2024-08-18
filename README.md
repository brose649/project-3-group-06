# project-3-group-06
-- Introduction --

Our project delves into the intriguing world of Unidentified Flying Objects, or UFO sightings, a topic that has captured the imagination of people worldwide. Interest in analyzing and visualizing this data was driven by our curiosity about the trends and patterns in the sightings over the years. We wondered how often the sightings vary across different regions and at times, and if there are any noticeable spikes which may coincide with some significant events.

Inspiration for our project was drawn from several sources, most notably a 2016 UFO sightings dashboard created by Ken Flerlage. Ken’s work stood out to us for its thoughtful design and use of color, which made complex data both accessible and visually appealing. We aimed to incorporate similar design principles into our project to create a dashboard that is not only informative but also engaging for our audience

Through our analysis, we hope to shed light on how often and where UFO sightings are happening, providing users with an easy tool of exploration into this mystery. Whether skeptic or believer, we believe you will find something interesting in our data.

-- Exploratory Data Analysis – Data Cleaning – SQLite creation -- 

The dataset we chose was UFO Sightings from Kaggle.  This was a CSV file of over 80,000 reports of UFO sightings in the last century from all over the world. This data was collected by the National UFO Reporting Center. The dataset from Kaggle contained two files, a complete CSV and a scrubbed CSV. The scrubbed CSV omitted records that had missing or erroneous locations and time fields. Our team decided to use the scrubbed file since it already took care of an essential part of the data cleaning process.

Utilizing the scrubbed file, we began our work of data cleaning and engineering which included trying to narrow the scope of the project from over 80.3k records to something hopefully more manageable. Through some exploratory data analysis, we figured out that most UFO sightings started occurring around the 1990’s. Since the latest year included was 2014, we chose to focus on only 20 years of data from 1994 – 2014. To help narrow down the dataset even further, we decided to focus on only sightings from the United States.

For the shapes field, there were 29 unique values.  Our intent was to try to use this field as one of the filters on the map. But we felt that 29 ways to filter on the map was too much. Some of these values (hexagon, delta, round, crescent, pyramid, flare, dome, changed, cross, cone) did not constitute a sizable portion of the data. We dropped those values, confident that it would not impact or skew the data in any significant way. For the remaining shapes, we grouped them by similarity and created a parent category for them: Other, Angular, Rectangular, Circular, Luminous, Elliptical, Formation, and Uncategorized.

After our data cleaning and data engineering, we were left with approximately 58.6k records which we decided was the most data filtering and slicing we were willing to do without further skewing the completeness and accuracy of the data. At this point we were ready to send our curated data into an SQLite database.

You can see the results of our data exploration at https://thetiiide.pythonanywhere.com