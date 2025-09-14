const toMask = (ss: string | null) => {
    return ss && ss.length > 3
        ? ss
              .split("")
              .map((_, i) => {
                  if (i === 0 || ss.length - 3 <= i) {
                      return _;
                  } else {
                      return "*";
                  }
              })
              .join("")
        : "";
};

export { toMask };
