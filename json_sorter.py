# import json
# with open('data/flags.json', 'r') as f:
#     d = json.load(f)
# s = dict(sorted(d.items(), key=lambda item: item[1]))
# with open('data/flags.json', 'w') as f:
#     json.dump(s, f, indent=4)

import json
with open('data/flags.json', 'r') as f:
    fd = json.load(f)
with open('UN Member States + 2 Observers', 'r') as f:
    a3 = f.read().splitlines()
mv = [value for value in fd.values() if value not in a3]
with open('Disputed Countries', 'w') as f:
    for value in mv:
        f.write(value + '\n')