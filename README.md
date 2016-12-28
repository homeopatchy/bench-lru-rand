# bench-lru-rand

Based on [bench-lru](https://github.com/dominictarr/bench-lru) but benchmarks cache hits and misses on a constrained memory setting.

To run it just `npm install` and `npm start`.

My results:

```shell
name                perf  hits    misses
-                   -     -       -
hashlru             91    6453    43547
hashlru-multilayer  93    7252    42748
modern-lru          67    8383    41617
lru_cache           100   15376   34624
lru-fast            72    8383    41617
```
