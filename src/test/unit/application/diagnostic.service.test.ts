import { DiagnosticService } from '../../../application/services';
import { MockDiagnosticRepository, MockEventBus, MockUI, MockFileSystem } from '../../fixtures/mocks.fixture';
import { mockDiagnostics } from '../../fixtures/diagnostics.fixture';
import { DiagnosticError } from '../../../shared/errors';

describe('DiagnosticService', () => {
  let service: DiagnosticService;
  let repository: MockDiagnosticRepository;
  let eventBus: MockEventBus;
  let ui: MockUI;
  let fs: MockFileSystem;

  beforeEach(() => {
    repository = new MockDiagnosticRepository();
    eventBus = new MockEventBus();
    ui = new MockUI();
    fs = new MockFileSystem();
    service = new DiagnosticService(repository, eventBus, ui, fs);
  });

  describe('exportDiagnostics', () => {
    it('should export diagnostics successfully', async () => {
      await service.exportDiagnostics('/output/path', 'csv');

      expect(repository.getAllDiagnostics).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DiagnosticExportStarted'
        })
      );
      expect(fs.ensureDir).toHaveBeenCalledWith('/output/path');
      expect(ui.showInfo).toHaveBeenCalledWith(
        expect.stringContaining('Successfully exported')
      );
    });

    it('should handle empty diagnostics case', async () => {
      repository.getAllDiagnostics.mockResolvedValueOnce([]);
      
      await service.exportDiagnostics('/output/path', 'csv');
      
      expect(ui.showInfo).toHaveBeenCalledWith('No diagnostics found to export.');
      expect(repository.exportDiagnostics).not.toHaveBeenCalled();
    });

    it('should handle export errors', async () => {
      repository.exportDiagnostics.mockRejectedValueOnce(new Error('Export failed'));
      
      await expect(service.exportDiagnostics('/output/path', 'csv'))
        .rejects
        .toThrow(DiagnosticError);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DiagnosticExportFailed'
        })
      );
    });
  });
});
