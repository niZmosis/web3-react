export default function SpacerView({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      style={{
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 16,
        marginBottom: 16,
        ...style
      }}
    />
  )
}
