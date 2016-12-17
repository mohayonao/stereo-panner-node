import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-1, 1, 50)
y = np.cos(np.linspace(0, 0.5 * np.pi))

plt.title("curve")
plt.grid()
plt.xlim(-1, 1)
plt.ylim(-1.05, +1.05)
plt.plot(x, y)
plt.show()
