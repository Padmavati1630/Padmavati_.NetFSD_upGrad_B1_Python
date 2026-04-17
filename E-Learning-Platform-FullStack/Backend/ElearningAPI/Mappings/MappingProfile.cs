using AutoMapper;
using ElearningAPI.Models;
using ElearningAPI.DTOs;

namespace ElearningAPI.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CourseId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

        CreateMap<CreateCourseDto, Course>();
        
        CreateMap<Lesson, LessonDto>().ReverseMap();
        CreateMap<CreateLessonDto, Lesson>();
        
        CreateMap<Quiz, QuizDto>().ReverseMap();
        CreateMap<CreateQuizDto, Quiz>();

        CreateMap<CreateQuestionDto, Question>();
    }
}
