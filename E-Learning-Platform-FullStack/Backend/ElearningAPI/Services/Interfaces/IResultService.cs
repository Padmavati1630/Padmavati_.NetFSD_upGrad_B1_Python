using ElearningAPI.DTOs;

namespace ElearningAPI.Services.Interfaces;

public interface IResultService
{
    Task<IEnumerable<ResultDto>> GetResultsByUser(int userId);
    Task<bool> ClearResults(int userId);
}