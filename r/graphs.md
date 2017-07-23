# Graphs
### Contents
- [Multiple dnorms on same graph]()

### Multiple dnorms on same graph
```
x <- 0:500
plot(x, dnorm(x, 250, 80), type="l", lwd=2, xlab="Score", ylab="PDF", ylim=c(0, .008), main="Theoretical increase in accuracy")
lines(x, dnorm(x, 250, 50), type="l", lwd=2, col="red")
legend("topright", c("m=250, sd=80", "m=250, sd=50"), lty=c(1, 1), lwd=c(2, 2), col=c("black", "red"))
```
[Top]()
