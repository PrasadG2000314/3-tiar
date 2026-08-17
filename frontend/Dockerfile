# 1. පදනම් කරගන්නා පරිසරය 
FROM node:18-alpine

# 2. Container එක ඇතුලේ වැඩ කරන ෆෝල්ඩරය
WORKDIR /app

# 3. package.json ෆයිල්ස් කොපි කිරීම
COPY package*.json ./

# 4. අවශ්‍ය Packages Install කිරීම
RUN npm install

# 5. ඉතුරු කේත සියල්ල කොපි කිරීම
COPY . .

# 6. React (Vite) වැඩ කරන Port එක විවෘත කිරීම
EXPOSE 5173

# 7. React App එක ධාවනය කරන විදිහ 
# (Vite වලදී පිටතින් access කිරීමට --host ලබා දිය යුතුය)
CMD ["npm", "run", "dev", "--", "--host"]
