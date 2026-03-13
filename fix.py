import os
path = "purposely-simulator.html"
with open(path, "rb") as f:
    text = f.read().decode('utf-8')

text = text.replace("charity'€™s", "charity's")
text = text.replace("charity’s", "charity's")
text = text.replace("charityâ€™s", "charity's")
text = text.replace("charity'â€™s", "charity's")
text = text.replace("ðŸŒŸ", "🌟")
text = text.replace("â€¢", "•")
text = text.replace("â€“", "-")
text = text.replace("â€˜", "'")
text = text.replace("â€œ", '"')
text = text.replace("â€", '"')

with open(path, "wb") as f:
    f.write(text.encode('utf-8'))
print("Done fixing encoding issues.")
