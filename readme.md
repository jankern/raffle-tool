# Raffle

A simple community raffle application, that takes two csv files as input to include two types of raffle participants.
You can determine a number of winners and optionally define prices.
The draw will then be made from the pool of participants in the input files.

## Example file content

### File type 1
```bash
first_name,last_name,email,plan_name,plan_monthly_amount_cents,gifted,subscription_period,subscription_state,subscribed_at,trial_ends_at,cancelled_at,expires_at,shipping_first_name,shipping_last_name,shipping_company_name,shipping_street_and_number,shipping_city,shipping_zip_code,shipping_state,shipping_country_code,new_plan_name,new_plan_monthly_amount_cents,price_increase_opt_in_email_sent_at,price_increase_opted_in_at,price_increase_new_plan_monthly_amount_cents
Jane,Doe,info@example-supporter-long.com,,600,false,monthly,active,2022-06-08,,,,,,,,,,,,,,2023-08-21,,
```
### File type 2
```bash
email,opted_in_at
jane.doe2@example-newsletter.com,2024-03-20 08:43:10.035321Z
```

## Development
For the frontend, run  
```bash
cd frontend
npm i
```
Since there is no hot reloading for esbuild, run the build 
```bash
npm run build
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)