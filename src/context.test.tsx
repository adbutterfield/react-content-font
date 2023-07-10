import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FontContext, { useFontContext } from './context';

function TestComponentContent() {
  const { isFontLoaded } = useFontContext();
  const [showExtraElementNode, setShowExtraElementNode] = useState(false);
  const [showExtraTextNode, setShowExtraTextNode] = useState(false);
  const [showDoubleTextNode, setShowDoubleTextNode] = useState(false);

  return (
    <div data-testid="content" style={{ visibility: isFontLoaded ? 'visible' : 'hidden' }}>
      <button onClick={() => setShowExtraTextNode(true)}>show extra text</button>
      <button onClick={() => setShowDoubleTextNode(true)}>show double text</button>
      <p>
        多年ではもし聞えるば合っだだろたないて、とうていちゃんと教えるてお話はそう詳しいなく事た。
        {showDoubleTextNode &&
          '多年ではもし聞えるば合っだだろたないて、とうていちゃんと教えるてお話はそう詳しいなく事た。'}
        {showExtraTextNode &&
          '多私はもし会にあれでしょようと充たすておきたのたてそれでこう驚がた見えでです。'}
      </p>
      <button onClick={() => setShowExtraElementNode(true)}>show extra element</button>
      {showExtraElementNode && (
        <p data-testid="extra-element">
          たとえば常に陰ご意味かもに与えているますものは、心的一種といった事は文壇的朋党に申して、もし自力が大きく訳のようにやっ方ませ。一生方たり間接からは博奕も事悪いけれどもも、人々はとうとうよっしでた。相当がし、他とあり、主義人に嫌う、正直でのませんず。そうして所々で他を見るうち、人で自分とやま上、すこぶる自由です詩にするから人身でするたているうば、教授自己の鉱脈でするば、あなたで不安正しいしからおきものなて使おたて下さいんた。否域の不愉快だうちには、壇がない富去就からすこぶる会員がある訳に、私がはざっとどうのようにするられた。
        </p>
      )}
    </div>
  );
}

function TestComponent() {
  return (
    <FontContext fontName="Noto Serif JP">
      <TestComponentContent />
    </FontContext>
  );
}

describe('<FontContext />', () => {
  test('should initialize with preconnect link tag', () => {
    const { container } = render(<TestComponent />);

    const gstaticLink = container.querySelector(
      'link[rel="preconnect"][href="https://fonts.gstatic.com"]',
    );
    expect(gstaticLink).toBeInTheDocument();

    const googleapisLink = container.querySelector(
      'link[rel="preconnect"][href="https://fonts.googleapis.com"]',
    );
    expect(googleapisLink).toBeInTheDocument();
  });

  test('should request font link tags on mount', () => {
    const { container } = render(<TestComponent />);

    const fontLinkTags = container.querySelectorAll('link[rel="stylesheet"]');
    expect(fontLinkTags.length).toEqual(1);
    expect(fontLinkTags[0].getAttribute('href')).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=show%20extradubl%E5%A4%9A%E5%B9%B4%E3%81%A7%E3%81%AF%E3%82%82%E3%81%97%E8%81%9E%E3%81%88%E3%82%8B%E3%81%B0%E5%90%88%E3%81%A3%E3%81%A0%E3%82%8D%E3%81%9F%E3%81%AA%E3%81%84%E3%81%A6%E3%80%81%E3%81%A8%E3%81%86%E3%81%A1%E3%82%83%E3%82%93%E6%95%99%E3%81%8A%E8%A9%B1%E3%81%9D%E8%A9%B3%E3%81%8F%E4%BA%8B%E3%80%82mn&display=swap',
    );
  });

  test('should add font link tags when text nodes change', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent />);

    expect(container.querySelectorAll('link[rel="stylesheet"]').length).toEqual(1);
    await user.click(screen.getByText('show extra text'));
    expect(container.querySelectorAll('link[rel="stylesheet"]').length).toEqual(2);
    const fontLinkTags = container.querySelectorAll('link[rel="stylesheet"]');
    expect(fontLinkTags[0].getAttribute('href')).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=show%20extradubl%E5%A4%9A%E5%B9%B4%E3%81%A7%E3%81%AF%E3%82%82%E3%81%97%E8%81%9E%E3%81%88%E3%82%8B%E3%81%B0%E5%90%88%E3%81%A3%E3%81%A0%E3%82%8D%E3%81%9F%E3%81%AA%E3%81%84%E3%81%A6%E3%80%81%E3%81%A8%E3%81%86%E3%81%A1%E3%82%83%E3%82%93%E6%95%99%E3%81%8A%E8%A9%B1%E3%81%9D%E8%A9%B3%E3%81%8F%E4%BA%8B%E3%80%82mn&display=swap',
    );
    expect(fontLinkTags[1].getAttribute('href')).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=%E7%A7%81%E4%BC%9A%E3%81%AB%E3%81%82%E3%82%8C%E3%82%87%E3%82%88%E5%85%85%E3%81%99%E3%81%8D%E3%81%AE%E3%81%93%E9%A9%9A%E3%81%8C%E8%A6%8B&display=swap',
    );
  });

  test('should add font link tags when element nodes are added', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent />);

    expect(container.querySelectorAll('link[rel="stylesheet"]').length).toEqual(1);
    expect(screen.queryByTestId('extra-element')).toBeNull();
    await user.click(screen.getByText('show extra element'));
    expect(screen.getByTestId('extra-element')).toBeInTheDocument();
    expect(container.querySelectorAll('link[rel="stylesheet"]').length).toEqual(2);
    const fontLinkTags = container.querySelectorAll('link[rel="stylesheet"]');
    expect(fontLinkTags[0].getAttribute('href')).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=show%20extradubl%E5%A4%9A%E5%B9%B4%E3%81%A7%E3%81%AF%E3%82%82%E3%81%97%E8%81%9E%E3%81%88%E3%82%8B%E3%81%B0%E5%90%88%E3%81%A3%E3%81%A0%E3%82%8D%E3%81%9F%E3%81%AA%E3%81%84%E3%81%A6%E3%80%81%E3%81%A8%E3%81%86%E3%81%A1%E3%82%83%E3%82%93%E6%95%99%E3%81%8A%E8%A9%B1%E3%81%9D%E8%A9%B3%E3%81%8F%E4%BA%8B%E3%80%82mn&display=swap',
    );
    expect(fontLinkTags[1].getAttribute('href')).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=%E5%B8%B8%E3%81%AB%E9%99%B0%E3%81%94%E6%84%8F%E5%91%B3%E3%81%8B%E4%B8%8E%E3%81%BE%E3%81%99%E3%81%AE%E5%BF%83%E7%9A%84%E4%B8%80%E7%A8%AE%E6%96%87%E5%A3%87%E6%9C%8B%E5%85%9A%E7%94%B3%E8%87%AA%E5%8A%9B%E3%81%8C%E5%A4%A7%E3%81%8D%E8%A8%B3%E3%82%88%E3%82%84%E6%96%B9%E3%81%9B%E7%94%9F%E3%82%8A%E9%96%93%E6%8E%A5%E3%82%89%E5%8D%9A%E5%A5%95%E6%82%AA%E3%81%91%E3%82%8C%E3%81%A9%E4%BA%BA%E3%80%85%E7%9B%B8%E5%BD%93%E4%BB%96%E3%81%82%E4%B8%BB%E7%BE%A9%E5%AB%8C%E6%AD%A3%E7%9B%B4%E3%81%9A%E6%89%80%E3%82%92%E8%A6%8B%E5%88%86%E4%B8%8A%E3%81%93%E3%81%B6%E7%94%B1%E8%A9%A9%E8%BA%AB%E6%8E%88%E5%B7%B1%E9%89%B1%E8%84%88%E4%B8%8D%E5%AE%89%E4%BD%BF%E4%B8%8B%E3%81%95%E5%90%A6%E5%9F%9F%E6%84%89%E5%BF%AB%E5%AF%8C%E5%8E%BB%E5%B0%B1%E4%BC%9A%E5%93%A1%E7%A7%81%E3%81%96&display=swap',
    );
  });

  test('should not add font link tags when no new characters are added', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent />);

    const fontLinkTags = container.querySelectorAll('link[rel="stylesheet"]');
    expect(fontLinkTags.length).toEqual(1);
    await user.click(screen.getByText('show double text'));
    expect(fontLinkTags.length).toEqual(1);
  });
});

const DummyComponent = () => {
  useFontContext();
  return null;
};

describe('useFontContext', () => {
  test('should set isFontLoaded to true after font is loaded', async () => {
    const { container } = render(<TestComponent />);

    expect(screen.getByTestId('content')).not.toBeVisible();
    const linkElements = container.querySelectorAll('link');
    fireEvent.load(linkElements[linkElements.length - 1]);
    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeVisible();
    });
  });

  test('throws an error when used outside FontContext', () => {
    // silence error logw for this test
    const error = jest.spyOn(console, 'error');
    error.mockImplementation(jest.fn());
    expect(() => render(<DummyComponent />)).toThrowError(
      'useFontContext must be used within a FontContext',
    );
    error.mockRestore();
  });
});
