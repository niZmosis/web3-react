import Image from 'next/image'

import Button from './Button'

export default function Tabs({
  data,
  selectedIndex,
  setSelectedIndex,
}: {
  data: { title: string; iconUrl?: string }[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}) {
  if (!data?.length) {
    return null
  }

  return (
    <div
      style={{
        width: '100%',
        overflowY: 'hidden',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingTop: '1rem',
        paddingBottom: '1rem',
      }}
    >
      {data.map((tab, index) => (
        <Button
          key={tab.title}
          style={{
            height: 44,
            minWidth: 100,
            marginLeft: !index ? '1rem' : 0,
            marginRight: index === data.length - 1 ? '1rem' : 0,
            color: selectedIndex === index ? 'rgba(0, 0, 0, 0.8)' : 'white',
            display: 'inline-flex', // inline-flex to keep them in line
            justifyContent: 'center',
            alignItems: 'center',
          }}
          color={selectedIndex === index ? 'rgba(255, 255, 255, 0.8)' : 'transparent'}
          borderColor="transparent"
          onClick={() => setSelectedIndex(index)}
        >
          <>
            {tab?.iconUrl && (
              <Image
                alt={`${tab.title} Logo`}
                width={24}
                height={24}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 12,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow:
                    'rgb(0 0 0 / 50%) 0px 0px 6px 0px, rgb(255 255 255 / 12%) 0px 0px 0px 1px, rgb(0 0 0 / 20%) 1px 1px 1px',
                }}
                src={tab?.iconUrl ?? ''}
              />
            )}
            {tab.title}
          </>
        </Button>
      ))}
    </div>
  )
}
