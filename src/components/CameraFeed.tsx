const CameraFeed = () => {
    const cameras = ['cam1.png', 'cam2.png', 'cam3.png', 'cam4.png']; // 하드코딩 이미지

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            {cameras.map((src, i) => (
                <img key={i} src={`/assets/${src}`} alt={`camera ${i}`} style={{ width: 120, borderRadius: 8 }} />
            ))}
        </div>
    );
};

export default CameraFeed;
