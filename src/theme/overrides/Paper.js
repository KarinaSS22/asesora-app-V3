function Paper() {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px',
          boxShadow: '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)'
        }
      }
    }
  };
}

export default Paper;