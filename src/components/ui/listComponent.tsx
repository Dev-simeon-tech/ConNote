type ListComponentProps = {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
};

const ListComponent = ({ data, renderItem }: ListComponentProps) => {
  return <>{data.map((item, index) => renderItem(item, index))}</>;
};

export default ListComponent;
