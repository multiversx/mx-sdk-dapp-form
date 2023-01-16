export const customStyles = ({ customProps }: { customProps: any }) => {
  return {
    valueContainer: () => ({
      padding: "0",
      lineHeight: "1.5",
      fontSize: "1rem",
      "@media (min-width: 768px)": {
        fontSize: "16px",
      },
      height: customProps.fullSize ? "4.25rem" : "3.5rem",
    }),
    control: (props: any) => ({
      ...props,
      overflow: "hidden",
      minHeight: "0",
      borderTopLeftRadius: customProps.fullSize ? "0.45rem" : "1.875rem",
      borderBottomLeftRadius: customProps.fullSize ? "0.45rem" : "1.875rem",
      borderTopRightRadius: "0.45rem",
      borderBottomRightRadius: "0.45rem",
      "&:hover": {
        height: "100%",
      },
    }),
    input: (props: any) => ({
      ...props,
      maxWidth: customProps.fullSize ? "100%" : "10rem",
      overflow: "hidden",
      marginTop: "1.125rem",
      paddingLeft: "0.625rem",
      fontSize: "0.625rem",
      "@media (min-width: 768px)": {
        marginTop: "0.9rem",
        paddingLeft: "1rem",
        fontSize: "1rem",
      },
    }),
    placeholder: (props: any) => ({
      ...props,
      paddingRight: "1.5rem",
      fontSize: "0.625rem",
      paddingLeft: "0.625rem",
      "@media (min-width: 768px)": {
        fontSize: "1rem",
        paddingLeft: "1rem",
      },
    }),
    indicatorSeparator: (props: any) => ({
      ...props,
      display: "none",
    }),
    dropdownIndicator: (props: any) => ({
      ...props,
      padding: "0 0.4rem 0 0",
    }),
    singleValue: (props: any) => ({
      ...props,
      marginLeft: "1rem",
      width: customProps.fullSize ? "83%" : "auto",
      "@media (min-width: 768px)": {
        marginLeft: "0.2rem",
        width: customProps.fullSize ? "92%" : "auto",
      },
    }),
    option: (props: any, { isFocused, isSelected }: any) => ({
      ...props,
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: isSelected
        ? customProps.primaryColor
        : isFocused
        ? "#e2e2e2"
        : "transparent",
    }),
    menu: (props: any) => ({
      ...props,
      marginTop: "0.2rem",
      zIndex: "5",
      "@media (max-width: 767px)": {
        width: "12.2rem",
        marginLeft: "-4rem",
      },
    }),
    container: (props: any) => ({
      ...props,
      width: customProps.fullSize ? "100%" : "8rem",
      "@media (min-width: 768px)": {
        width: customProps.fullSize ? "100%" : "11rem",
      },
    }),
  };
};
