# Multi Platform Aggregator

## Core Feature

**Aggregator**

- Endpoint to get data from 5 external public APIs based on location and return the aggregated data with proper output format.
  - Geolocation API (e.g. country, coordinates, currency)
  - Weather API (e.g. weather, temperature)
  - Timezone API (e.g. current timezone, formatted time)
  - News API (e.g. latest headlines/articles)
  - Currency Exchange API (e.g. country currency conversion against other currencies)
- Check In-Memory Cache.
  - If data for the location exists and is fresh (within 10 minutes), return it.
- Check Database.
  - If data exists in the database and is fresh, return it.
  - If data is stale (>10 minutes), proceed to fetch from external APIs.
- Fetch from External APIs.
  - If data is not in cache or database, or is stale, query all 5 public APIs.
  - Aggregate their results into a single unified object.
  - Store the aggregated result in memory cache with 10 minutes TTL and database with timestamps.

```
Request -> Memory Cache -> Database -> External APIs -> Response
                          ↑             ↓
              (data < 10 min?)    Save to DB & Cache
```

### External APIs details

- [OpenCage Geocoding API](https://opencagedata.com): `/geocode/v1/json`
  - Accept `location` as param and return `coordinates`, `country`, `city` and `currency` etc.
- [OpenWeather API](https://openweathermap.org): `/data/2.5/weather`
  - Accept `coordinates i.e. lat and lng` as params and return `weather forcast` and `temperature` etc.
- [Time zone database API](https://timezonedb.com): `/v2.1/get-time-zone`
  - Accept `coordinates i.e. lat and lng` as params and return `regionName`, `gmtOffset`, `formatted time` and `timestamp` etc.
- [News API](https://newsapi.org): `/v2/everything`
  - Accept `location` as param and return latest `headlines` and `articles` with `sources`.
- [Exchange Rate API](https://www.exchangerate-api.com): `/v6`
  - Accept `currency` as param and return latest conversion against other currencies.

## API Chaining

- The aggregator API totally depends upon the response of Geolocation API.
- Extract `latitude`, `longitude`, and `currency iso_code` from the Geolocation API response.
- Use them as input parameters for the following APIs:
  - Weather API -> requires `lat` and `lng` for weather data
  - Timezone API -> requires `lat` and `lng` to determine the correct timezone.
  - Currency Exchange API -> requires `currency iso_code` to fetch relevant exchange rates.

## API Caching

Caching was managed in two layers, i.e. using memory-cache and MongoDB.

- Used [memory-cache](https://www.npmjs.com/package/memory-cache) (in-memory) npm package for fast, short-term access with a TTL of 10 minutes. Used it because it has a simpler setup and requires no additional no additional setup.
- Used MongoDB as a persistent database and timestamps. Compared the `updatedAt` field against the current time to retrieve only data updated within the last 10 minutes.

### Tech Used

- Nestjs
- Prisma ORM
- Mongodb
- memory-cache (npm package)

# API Endpoints

| Endpoint                                   | Method | Description                              |
| ------------------------------------------ | ------ | ---------------------------------------- |
| `/v1/aggregate?location=<city_or_country>` | GET    | Get aggregated data from 5 external APIs |

# Installation

**Clone the repository**

```bash
git clone https://github.com/iamibadd/multi-platform-aggregator
cd multi-platform-aggregator
```

**Configure Environment Variables**

Create a `.env` file in the project root and update the configuration:

```bash
PORT = 5001
API_VERSION = v1
DATABASE_URL = {YOUR_MONGODB_DATABSE_URL}
GEO_LOCATION_API = https://api.opencagedata.com
GEO_LOCATION_API_KEY = {GEO_LOCATION_API_KEY}
WEATHER_API = https://api.openweathermap.org
WEATHER_API_KEY = {WEATHER_API_KEY}
TIMEZONE_API = http://api.timezonedb.com
TIMEZONE_API_KEY = {TIMEZONE_API_KEY}
NEWS_API = https://newsapi.org
NEWS_API_KEY = {NEWS_API_KEY}
CURRENCY_API = https://v6.exchangerate-api.com
CURRENCY_API_KEY = {CURRENCY_API_KEY}
```

**Note**

**Replica set configuration**

MongoDB only allows you to start a transaction on a replica set. Prisma ORM uses transactions internally to avoid partial writes on nested queries. This means we inherit the requirement of needing a replica set configured.

When you try to use Prisma ORM's MongoDB connector on a deployment that has no replica set configured, Prisma ORM shows the message Error: Transactions are not supported by this deployment. The full text of the error message is the following:

```
PrismaClientUnknownRequestError2 [PrismaClientUnknownRequestError]:
Invalid `prisma.post.create()` invocation in
/index.ts:9:21

   6 await prisma.$connect()
   7
   8 // Create the first post
→  9 await prisma.post.create(
  Error in connector: Database error. error code: unknown, error message: Transactions are not supported by this deployment
    at cb (/node_modules/@prisma/client/runtime/index.js:34804:17)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  clientVersion: '3.xx.0'
}
```

To resolve this, we suggest you change your deployment to one with a replica set configured.

One simple way for this is to use MongoDB Atlas to launch a free instance that has replica set support out of the box.

There's also an option to run the replica set locally with this guide: https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set

Source: https://www.prisma.io/docs/orm/overview/databases/mongodb

_I have used MongoDB Atlas to launch a free instance that has replica set support._

**Run the Application in development mode**

```bash
npm i
npm run start:dev
```

**Run the Application in production mode**

```bash
docker compose up --build
```

# Extra

- Added a minimal Swagger documentation of the API with expected responses.
- Visit `/docs` route to view the documentation.

# API responses

**When all API calls succeed**

```
{
    "status": "success",
    "location": "Islamabad",
    "geo": {
        "status": "success",
        "coordinates": {
            "lat": 33.6938118,
            "lng": 73.0651511
        },
        "currency": {
            "alternate_symbols": [
                "Rs"
            ],
            "decimal_mark": ".",
            "disambiguate_symbol": "PKR",
            "html_entity": "&#x20A8;",
            "iso_code": "PKR",
            "iso_numeric": "586",
            "name": "Pakistani Rupee",
            "smallest_denomination": 100,
            "subunit": "Paisa",
            "subunit_to_unit": 100,
            "symbol": "₨",
            "symbol_first": 1,
            "thousands_separator": ","
        }
    },
    "weather": {
        "status": "success",
        "weather": {
            "id": 801,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02d"
        },
        "temperature": {
            "temp": 298.52,
            "feels_like": 298.97,
            "temp_min": 298.52,
            "temp_max": 298.52,
            "pressure": 1006,
            "humidity": 71,
            "sea_level": 1006,
            "grnd_level": 930
        }
    },
    "timezone": {
        "status": "success",
        "data": {
            "message": "",
            "countryCode": "PK",
            "countryName": "Pakistan",
            "regionName": "Islamabad",
            "cityName": "Islamabad",
            "zoneName": "Asia/Karachi",
            "abbreviation": "PKT",
            "gmtOffset": 18000,
            "dst": "0",
            "zoneStart": 1257012000,
            "zoneEnd": null,
            "nextAbbreviation": null,
            "timestamp": 1748236491,
            "formatted": "2025-05-26 05:14:51"
        }
    },
    "news": {
        "status": "success",
        "articles": [
            {
                "source": {
                    "id": null,
                    "name": "Statetimes.in"
                },
                "author": "statetimes_editor",
                "title": "Will not be silenced by terrorism, says Tharoor",
                "description": "STATE TIMES NEWS NEW DELHI: Congress MP Shashi Tharoor, who is leading a multi-party delegation to five countries, has asserted the mission would be to give the world the message that “we will not be silenced by terrorism” and that “we don’t want the world to…",
                "url": "https://statetimes.in/will-not-be-silenced-by-terrorism-says-tharoor/",
                "urlToImage": "https://statetimes.in/wp-content/uploads/2025/05/SASHI-TAHROOR-1024x576.jpg",
                "publishedAt": "2025-05-24T18:34:11Z",
                "content": "STATE TIMES NEWS\r\nNEW DELHI: Congress MP Shashi Tharoor, who is leading a multi-party delegation to five countries, has asserted the mission would be to give the world the message that “we will not b… [+2671 chars]"
            }
        ]
    },
    "currency": {
        "status": "success",
        "conversion_rates": {
            "PKR": 1,
            "AED": 0.01299,
            "AFN": 0.2476,
            "ALL": 0.3067,
            "AMD": 1.3591,
            "ANG": 0.00633,
            "AOA": 3.2453,
            "ARS": 4.0207,
            "AUD": 0.005438,
            "AWG": 0.00633,
            "AZN": 0.00602,
            "BAM": 0.006085,
            "BBD": 0.007073,
            "BDT": 0.4312,
            "BGN": 0.006085,
            "BHD": 0.00133,
            "BIF": 10.5189,
            "BMD": 0.003536,
            "BND": 0.004544,
            "BOB": 0.02451,
            "BRL": 0.01998,
            "BSD": 0.003536,
            "BTN": 0.3014,
            "BWP": 0.04756,
            "BYN": 0.01156,
            "BZD": 0.007073,
            "CAD": 0.004854,
            "CDF": 10.2246,
            "CHF": 0.002904,
            "CLP": 3.3322,
            "CNY": 0.02535,
            "COP": 14.7223,
            "CRC": 1.7979,
            "CUP": 0.08487,
            "CVE": 0.3431,
            "CZK": 0.07724,
            "DJF": 0.6285,
            "DKK": 0.02319,
            "DOP": 0.2091,
            "DZD": 0.4686,
            "EGP": 0.1767,
            "ERN": 0.05304,
            "ETB": 0.4803,
            "EUR": 0.003108,
            "FJD": 0.007986,
            "FKP": 0.002613,
            "FOK": 0.02324,
            "GBP": 0.00261,
            "GEL": 0.009675,
            "GGP": 0.002613,
            "GHS": 0.03789,
            "GIP": 0.002613,
            "GMD": 0.2572,
            "GNF": 30.9312,
            "GTQ": 0.02717,
            "GYD": 0.7411,
            "HKD": 0.02766,
            "HNL": 0.09215,
            "HRK": 0.02344,
            "HTG": 0.4623,
            "HUF": 1.2557,
            "IDR": 57.2277,
            "ILS": 0.01274,
            "IMP": 0.002613,
            "INR": 0.301,
            "IQD": 4.6301,
            "IRR": 154.318,
            "ISK": 0.4512,
            "JEP": 0.002613,
            "JMD": 0.5631,
            "JOD": 0.002507,
            "JPY": 0.5044,
            "KES": 0.4576,
            "KGS": 0.3093,
            "KHR": 14.0769,
            "KID": 0.005445,
            "KMF": 1.5307,
            "KRW": 4.8349,
            "KWD": 0.001086,
            "KYD": 0.002947,
            "KZT": 1.8098,
            "LAK": 76.923,
            "LBP": 316.4948,
            "LKR": 1.0605,
            "LRD": 0.7081,
            "LSL": 0.06313,
            "LYD": 0.01932,
            "MAD": 0.03257,
            "MDL": 0.06128,
            "MGA": 15.9266,
            "MKD": 0.1928,
            "MMK": 7.4324,
            "MNT": 12.6923,
            "MOP": 0.02853,
            "MRU": 0.1406,
            "MUR": 0.1618,
            "MVR": 0.05474,
            "MWK": 6.1218,
            "MXN": 0.06793,
            "MYR": 0.01494,
            "MZN": 0.225,
            "NAD": 0.06313,
            "NGN": 5.6269,
            "NIO": 0.1303,
            "NOK": 0.03574,
            "NPR": 0.4823,
            "NZD": 0.005899,
            "OMR": 0.00136,
            "PAB": 0.003536,
            "PEN": 0.01297,
            "PGK": 0.01452,
            "PHP": 0.1956,
            "PLN": 0.01328,
            "PYG": 28.401,
            "QAR": 0.01287,
            "RON": 0.01575,
            "RSD": 0.3655,
            "RUB": 0.2809,
            "RWF": 4.9937,
            "SAR": 0.01326,
            "SBD": 0.03018,
            "SCR": 0.05174,
            "SDG": 1.6224,
            "SEK": 0.03363,
            "SGD": 0.004538,
            "SHP": 0.002613,
            "SLE": 0.08085,
            "SLL": 80.8511,
            "SOS": 2.0212,
            "SRD": 0.131,
            "SSP": 15.9664,
            "STN": 0.07623,
            "SYP": 45.6188,
            "SZL": 0.06313,
            "THB": 0.1149,
            "TJS": 0.03648,
            "TMT": 0.01244,
            "TND": 0.01057,
            "TOP": 0.00854,
            "TRY": 0.1377,
            "TTD": 0.02411,
            "TVD": 0.005445,
            "TWD": 0.1059,
            "TZS": 9.5062,
            "UAH": 0.147,
            "UGX": 12.8991,
            "USD": 0.003532,
            "UYU": 0.1473,
            "UZS": 45.1804,
            "VES": 0.3358,
            "VND": 91.7145,
            "VUV": 0.4303,
            "WST": 0.009682,
            "XAF": 2.041,
            "XCD": 0.009548,
            "XCG": 0.00633,
            "XDR": 0.0026,
            "XOF": 2.041,
            "XPF": 0.3713,
            "YER": 0.8634,
            "ZAR": 0.06304,
            "ZMW": 0.09755,
            "ZWL": 0.09499
        }
    }
}
```

When Timezone and News APIs fail (Partial response)

```
{
    "status": "success",
    "location": "England",
    "geo": {
        "status": "success",
        "coordinates": {
            "lat": 52.5310214,
            "lng": -1.2649062
        },
        "currency": {
            "alternate_symbols": [],
            "decimal_mark": ".",
            "html_entity": "&#x00A3;",
            "iso_code": "GBP",
            "iso_numeric": "826",
            "name": "British Pound",
            "smallest_denomination": 1,
            "subunit": "Penny",
            "subunit_to_unit": 100,
            "symbol": "£",
            "symbol_first": 1,
            "thousands_separator": ","
        }
    },
    "weather": {
        "status": "success",
        "weather": {
            "id": 802,
            "main": "Clouds",
            "description": "scattered clouds",
            "icon": "03n"
        },
        "temperature": {
            "temp": 284.48,
            "feels_like": 283.73,
            "temp_min": 283.93,
            "temp_max": 284.66,
            "pressure": 1012,
            "humidity": 79,
            "sea_level": 1012,
            "grnd_level": 1000
        }
    },
    "timezone": {
        "status": "error",
        "msg": "Invalid API key"
    },
    "news": {
        "status": "error",
        "msg": "Request failed with status code 400"
    },
    "currency": {
        "status": "success",
        "conversion_rates": {
            "GBP": 1,
            "AED": 4.966,
            "AFN": 94.6466,
            "ALL": 117.2277,
            "AMD": 519.9664,
            "ANG": 2.4205,
            "AOA": 1247.2255,
            "ARS": 1537.4805,
            "AUD": 2.0837,
            "AWG": 2.4205,
            "AZN": 2.3004,
            "BAM": 2.3271,
            "BBD": 2.7045,
            "BDT": 164.5371,
            "BGN": 2.3272,
            "BHD": 0.5084,
            "BIF": 4027.0777,
            "BMD": 1.3522,
            "BND": 1.7394,
            "BOB": 9.3699,
            "BRL": 7.6908,
            "BSD": 1.3522,
            "BTN": 115.1872,
            "BWP": 18.178,
            "BYN": 4.3476,
            "BZD": 2.7045,
            "CAD": 1.8591,
            "CDF": 3913.1038,
            "CHF": 1.113,
            "CLP": 1273.5517,
            "CNY": 9.7125,
            "COP": 5626.6498,
            "CRC": 687.267,
            "CUP": 32.4534,
            "CVE": 131.196,
            "CZK": 29.6009,
            "DJF": 240.3189,
            "DKK": 8.8763,
            "DOP": 79.9148,
            "DZD": 179.0988,
            "EGP": 67.5204,
            "ERN": 20.2834,
            "ETB": 182.1847,
            "EUR": 1.1899,
            "FJD": 3.0521,
            "FKP": 1,
            "FOK": 8.8767,
            "GEL": 3.7006,
            "GGP": 1,
            "GHS": 14.3537,
            "GIP": 1,
            "GMD": 98.4275,
            "GNF": 11825.8755,
            "GTQ": 10.3871,
            "GYD": 283.7134,
            "HKD": 10.585,
            "HNL": 35.225,
            "HRK": 8.9647,
            "HTG": 176.9578,
            "HUF": 481.0687,
            "IDR": 21882.357,
            "ILS": 4.8839,
            "IMP": 1,
            "INR": 115.26,
            "IQD": 1772.6026,
            "IRR": 58717.7487,
            "ISK": 172.7846,
            "JEP": 1,
            "JMD": 215.0327,
            "JOD": 0.9587,
            "JPY": 193.2332,
            "KES": 174.788,
            "KGS": 118.0231,
            "KHR": 5386.8701,
            "KID": 2.0824,
            "KMF": 585.3552,
            "KRW": 1851.3634,
            "KWD": 0.4145,
            "KYD": 1.1269,
            "KZT": 693.0091,
            "LAK": 29407.769,
            "LBP": 121024.1882,
            "LKR": 404.4909,
            "LRD": 270.66,
            "LSL": 24.132,
            "LYD": 7.3959,
            "MAD": 12.4453,
            "MDL": 23.4252,
            "MGA": 6101.1109,
            "MKD": 73.5388,
            "MMK": 3818.3867,
            "MNT": 4864.9456,
            "MOP": 10.9026,
            "MRU": 53.8407,
            "MUR": 61.4513,
            "MVR": 20.924,
            "MWK": 2346.342,
            "MXN": 26.0363,
            "MYR": 5.7225,
            "MZN": 86.1153,
            "NAD": 24.132,
            "NGN": 2149.2312,
            "NIO": 49.803,
            "NOK": 13.6848,
            "NPR": 184.2995,
            "NZD": 2.2608,
            "OMR": 0.5199,
            "PAB": 1.3522,
            "PEN": 4.9553,
            "PGK": 5.5468,
            "PHP": 74.913,
            "PKR": 383.0773,
            "PLN": 5.0607,
            "PYG": 10858.1114,
            "QAR": 4.9221,
            "RON": 6.0202,
            "RSD": 139.5772,
            "RUB": 107.5663,
            "RWF": 1927.3085,
            "SAR": 5.0708,
            "SBD": 11.5609,
            "SCR": 19.8194,
            "SDG": 605.5314,
            "SEK": 12.8788,
            "SGD": 1.7394,
            "SHP": 1,
            "SLE": 30.8574,
            "SLL": 30862.1462,
            "SOS": 773.8601,
            "SRD": 50.1984,
            "SSP": 6236.0901,
            "STN": 29.1507,
            "SYP": 17429.9411,
            "SZL": 24.132,
            "THB": 44.0047,
            "TJS": 14.3902,
            "TMT": 4.7247,
            "TND": 4.0357,
            "TOP": 3.2092,
            "TRY": 52.822,
            "TTD": 9.1965,
            "TVD": 2.0824,
            "TWD": 40.5804,
            "TZS": 3636.3732,
            "UAH": 56.1538,
            "UGX": 4927.1965,
            "USD": 1.3522,
            "UYU": 56.3033,
            "UZS": 17299.0574,
            "VES": 128.5692,
            "VND": 35130.1111,
            "VUV": 163.211,
            "WST": 3.6559,
            "XAF": 780.4736,
            "XCD": 3.651,
            "XCG": 2.4205,
            "XDR": 0.9918,
            "XOF": 780.4736,
            "XPF": 141.9841,
            "YER": 330.0086,
            "ZAR": 24.133,
            "ZMW": 37.344,
            "ZWL": 36.1877
        }
    }
}
```

Happy Hacking!
