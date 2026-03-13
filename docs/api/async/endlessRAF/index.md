# endlessRAF()
Создает вызов requestAnimationFrame, посылая туда фукнцию `quitFn`, если она возвращает true,
тогда повторно не будет создан вызов requestAnimationFrame, иначе будут создаваться повторно
вызовы requestAnimationFrame до тем пор, пока эта функция не вернёт true
