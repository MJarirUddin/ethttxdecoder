# Local environment

Here is a list of steps to recreate local environment on <b>Ubuntu</b> distribution.

1. Install needed packages using `apt`

      ```shell
    apt install docker-compose python3-pip pipenv make 
      ```
2. Run `pipenv install`. This will create new `venv` with all required packages installed, including `ethtx` library

3. Copy `.env_sample` to a new file: `.env`

```
  # Proper nodes are required to run ethtx, provide connection strings for chains which will be used.
  MAINNET_NODE_URL=https://eth-mainnet.alchemyapi.io/v2/cNC4XfxR7biwO2bfIO5aKcs9EMPxTQfr
  
  # Etherscan API is used to get contract source code, required for decoding process
  # You can get free key here https://etherscan.io/apis
  ETHERSCAN_KEY=JZWYWC5AAGTANCD1V14YVB22IUI483FXJM
  
  # Optional. Those represent data required for connecting to mongoDB. It's used for caching semantics
  # used in decoding process. But, it's not neccessary for running, If you don't want to use permanent
  # db or setup mongo, leave those values, mongomock package is used to simulate in-memory mongo.
  MONGO_CONNECTION_STRING=mongomock://localhost
  MONGODB_DB=ethtx
  
  
  # Optional. Credentials for accessing semantics editor page, available under '/semantics/<str:address>'
  ETHTX_ADMIN_USERNAME=admin
  ETHTX_ADMIN_PASSWORD=admin
 
  # Optional. Valid values are ['production', 'staging', 'development']. Those mainly
  # dictate what options are used for flask debugging and logging
  ENV=development
```
4. Run `pipenv run python3 wsgi.py` for `make run-local`. This will setup new server on host 0.0.0.0 port 5000.

5. Now `ethtx_ce` should be accessible through link [http://localhost:5000](http://localhost:5000) 

# .env file

For proper functioning, `.env` file is required containing all database and 3rd party providers configuration.
`.env_sample` file is provided in repository with example values.

Parameters `[CHAIN_ID]_NODE_URL` should hold valid urls to ethereum nodes; Parameter `ETHERSCAN_KEY` should be equal to
Etherscan API key assigned to user.
