type Props = {
  children: React.ReactNode;
};

export const CanvasWrapper = ({ children }: Props) => {
  return <div className="w-full h-full">{children}</div>;
};
