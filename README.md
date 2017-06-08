### To start project with default data
```
$ yarn
$ yarn start
```

if you want to change default presets, replace `data` variable content in `src/data.js` with yours; data format:
```
[
  {
    ts: number,   // timestamp ms
    value: number
  },
  ...
]
```