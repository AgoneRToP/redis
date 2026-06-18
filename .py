copies = 3000000
price = 3.99
gross_revenue = copies * price
print(f"Gross: {gross_revenue}")

# Steam tier logic:
# Up to 10,000,000: 30% fee
# From 10,000,000 to 50,000,000: 25% fee

if gross_revenue <= 10000000:
    steam_fee = gross_revenue * 0.30
    dev_share = gross_revenue * 0.70
else:
    tier1_revenue = 10000000
    tier2_revenue = gross_revenue - 10000000
    
    steam_fee_1 = tier1_revenue * 0.30
    steam_fee_2 = tier2_revenue * 0.25
    steam_fee = steam_fee_1 + steam_fee_2
    
    dev_share_1 = tier1_revenue * 0.70
    dev_share_2 = tier2_revenue * 0.75
    dev_share = dev_share_1 + dev_share_2

print(f"Steam fee: {steam_fee}")
print(f"Dev share before taxes: {dev_share}")
