# R
### Contents
- [Multiple dnorms on same graph](https://github.com/smatsushima1/home/blob/master/r/graphs.md#multiple-dnorms-on-same-graph)

### Multiple dnorms on same graph
```
x <- 0:100
plot(x, dnorm(x, 50, 10), type="l", lwd=2, xlab="x-axis", ylab="y-axis", ylim=c(0, .08), main="Multiple dnorms")
lines(x, dnorm(x, 50, 5), type="l", lwd=2, col="red")
legend("topright", c("m=50, sd=10", "m=50, sd=5"), lty=c(1, 1), lwd=c(2, 2), col=c("black", "red"))
```
![multiple_dnorms](/references/r_multiple_dnorms.png)
[Top](https://github.com/smatsushima1/home/blob/master/r/graphs.md#graphs)
