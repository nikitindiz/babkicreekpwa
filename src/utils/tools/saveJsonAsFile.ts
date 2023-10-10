interface SaveJsonAsFileArgs {
  fileName: string;
  dto: any;
}

export const saveJsonAsFile = ({ fileName, dto }: SaveJsonAsFileArgs) => {
  const blob = new Blob([JSON.stringify(dto)], { type: 'text/json' });
  const link = document.createElement('a');

  link.download = fileName;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};
