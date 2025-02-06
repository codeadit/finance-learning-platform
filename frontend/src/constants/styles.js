export const backgroundStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url(/background.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.3, // 30% transparency
      zIndex: -1,
    },
  };