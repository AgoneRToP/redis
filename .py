copies = 3000000
price = 3.99
gross_revenue = copies * price
print(f"Gross: {gross_revenue}")

# Полная логика уровней Steam:
# До 10,000,000: комиссия 30%
# От 10,000,000 до 50,000,000: комиссия 25%
# Свыше 50,000,000: комиссия 20%

if gross_revenue <= 10000000:
    steam_fee = gross_revenue * 0.30
    dev_share = gross_revenue * 0.70
elif gross_revenue <= 50000000:
    tier1_revenue = 10000000
    tier2_revenue = gross_revenue - 10000000
    
    steam_fee = (tier1_revenue * 0.30) + (tier2_revenue * 0.25)
    dev_share = (tier1_revenue * 0.70) + (tier2_revenue * 0.75)
else:
    tier1_revenue = 10000000
    tier2_revenue = 40000000
    tier3_revenue = gross_revenue - 50000000
    
    steam_fee = (tier1_revenue * 0.30) + (tier2_revenue * 0.25) + (tier3_revenue * 0.20)
    dev_share = (tier1_revenue * 0.70) + (tier2_revenue * 0.75) + (tier3_revenue * 0.80)

print(f"Steam fee: {steam_fee}")
print(f"Dev share before taxes: {dev_share}")
