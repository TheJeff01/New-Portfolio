import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const title = searchParams.has('title')
            ? searchParams.get('title')?.slice(0, 100)
            : 'BluDevs Blog';

        // Get the gradient type from the search params
        const gradientParam = searchParams.get('gradient') || "blue";

        // Map the gradient to CSS linear-gradients
        let gradientStyle = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(79, 70, 229, 0.2))'; // Default fallback
        if (gradientParam.includes('rose') || gradientParam.includes('pink')) gradientStyle = 'linear-gradient(135deg, rgba(244, 63, 94, 0.4), rgba(219, 39, 119, 0.4))';
        if (gradientParam.includes('blue') || gradientParam.includes('indigo')) gradientStyle = 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.4))';
        if (gradientParam.includes('amber') || gradientParam.includes('orange')) gradientStyle = 'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(234, 88, 12, 0.4))';
        if (gradientParam.includes('emerald') || gradientParam.includes('green')) gradientStyle = 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(22, 163, 74, 0.4))';
        if (gradientParam.includes('purple') || gradientParam.includes('fuchsia')) gradientStyle = 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(192, 38, 211, 0.4))';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: gradientStyle,
                        backgroundColor: '#0a0a0a',
                        padding: '80px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '32px',
                        padding: '60px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{
                                color: '#a1a1aa',
                                fontSize: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                            }}>
                                Article
                            </div>
                            <h1 style={{
                                fontSize: '64px',
                                fontWeight: 800,
                                color: '#ffffff',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.25,
                                marginBottom: 0,
                            }}>
                                {title}
                            </h1>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '24px',
                                    background: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#000000',
                                    fontWeight: 800,
                                    fontSize: '24px'
                                }}>
                                    B
                                </div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#f4f4f5',
                                }}>
                                    jeffthedev.vercel.app
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
