# Async

### sleep()
Создает промис, который будет ждать указанное количество ms, чтобы выполниться


### waitAsync()
**Deprecated:** используй `sleep`

Создает промис, который будет ждать указанное количество ms, чтобы выполниться


### endlessRAF()
Создает вызов requestAnimationFrame, посылая туда фукнцию `quitFn`, если она возвращает true,
тогда повторно не будет создан вызов requestAnimationFrame, иначе будут создаваться повторно
вызовы requestAnimationFrame до тем пор, пока эта функция не вернёт true


### setAbortableTimeout()
_No description._


### setAbortableInterval()
_No description._

