# Authentication and Core DB Setup - Sept 18, 2024

## User Authentication

    (1) Users should be able to authenticate themselves to easily access their information

        (1.a) Authenticate before or after using the product

            (1.a.i) Should be incentivized to authenticate before

        (1.b) Assign more readable names to index their uploads and results

            (1.b.i) New views and endpoints to show previous results

            (1.b.ii) New views and endpoints to delete uploads and results

- Protected routes
- Cost and integration into existing cloud-based ecosystem
- Somehow persist state (short term) for when user uses product before auth

## Bug Fixes

    (2) Fix bug where filenames may conflict and incorrectly return cache hit

        (2.a) Parallelize AWS textract API calls (response time vs. cost tradeoff to consider)

- POST document route shouldn't be protected
  - Need to make sure POSTs aren't updating same file in s3
    - Easiest to create UUID in frontend
- GET and DELETE routes should be protected

## Changes / Plan:

- Initial approach will be to use auth0 for authentication

  - Familiar with auth0, not much overhead - stable

- Using DynamoDB for backend
  - AWS ecosystem
  - noSQL - not sure how relationships and data will evolve. Also avoids coupling with frontend code since I don't want to invest time into ORM or other adjacent tools (yet)
