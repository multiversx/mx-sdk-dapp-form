export function selectCustomStyles({ docStyle }: { docStyle: any }) {
  const customColors = {
    hoverColor: docStyle.getPropertyValue('--border-color'),
    primaryColor: docStyle.getPropertyValue('--primary'),
    bgColor: docStyle.getPropertyValue('--card-bg'),
    mutedColor: docStyle.getPropertyValue('--muted'),
    blackColor: docStyle.getPropertyValue('--black')
  };

  return {
    valueContainer: () => ({
      padding: '0.125rem 0 0.125rem 0.2rem',
      lineHeight: '1.5',
      fontSize: '0.8125rem',
      maxWidth: '85%',
      display: 'flex'
    }),
    control: (props: any, state: any) => ({
      ...props,
      minHeight: '0',
      flexWrap: 'nowrap',
      backgroundColor: state.isDisabled ? '#e9ecef' : 'transparent',
      borderColor: state.isDisabled
        ? customColors.hoverColor
        : state.isFocused
        ? customColors.primaryColor
        : customColors.blackColor,
      boxShadow: state.isFocused
        ? `0 0 0 0.2rem #${customColors.primaryColor.replace('#', '').trim()}33`
        : null,
      '&:hover': {
        borderColor: state.isFocused ? customColors.primaryColor : '#b0b0b0'
      }
    }),
    input: (props: any) => ({
      ...props,
      paddingLeft: '0.4rem',
      marginLeft: '0',
      marginRight: '0'
    }),
    indicatorSeparator: (props: any) => ({
      ...props,
      marginTop: '0.3rem',
      marginBottom: '0.3rem'
    }),
    indicatorsContainer: (props: any) => ({
      ...props,
      zIndex: '0'
    }),
    dropdownIndicator: (props: any) => ({
      ...props,
      padding: '0 0.4rem'
    }),
    multiValue: (props: any) => ({
      ...props,
      backgroundColor: customColors.hoverColor,
      borderRadius: '4px'
    }),
    multiValueRemove: (props: any) => ({
      ...props,
      cursor: 'pointer'
    }),
    multiValueLebel: (props: any) => ({
      ...props,
      lineHeight: '1.5'
    }),
    placeholder: (props: any) => ({
      ...props,
      marginLeft: '0',
      lineHeight: '2'
    }),
    option: (props: any, { isFocused, isSelected }: any) => ({
      ...props,
      fontSize: '0.8125rem',
      cursor: 'pointer',
      align: 'left',
      backgroundColor: isSelected
        ? customColors.primaryColor
        : isFocused
        ? customColors.hoverColor
        : 'transparent'
    }),
    menu: (props: any) => ({
      ...props,
      marginTop: '0.2rem',
      zIndex: '5'
    })
  };
}

export default selectCustomStyles;
